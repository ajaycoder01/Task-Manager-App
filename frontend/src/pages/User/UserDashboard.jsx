
import React, { useContext, useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLaylout from '../../components/layouts/DashboardLaylout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import { addThousandSeperator } from '../../utils/helper';
import InfoCard from '../../components/Cards/InfoCard';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

const COLORS = ["#8D51FF", "#00B80B", "#7BCE00"];

const UserDashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Prepare chart data
  const prepareChartData = (charts) => {
    const taskDistribution = charts?.taskDistribution || {};
    const taskPriorityLevels = charts?.taskPriorityLevel || { Low: 0, Medium: 0, High: 0 };

    setPieChartData([
      { status: "Pending", count: taskDistribution.Pending || 0 },
      { status: "In Progress", count: taskDistribution.InProgress || 0 },
      { status: "Completed", count: taskDistribution.Completed || 0 },
    ]);

    setBarChartData([
      { priority: "Low", count: taskPriorityLevels.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels.Medium || 0 },
      { priority: "High", count: taskPriorityLevels.High || 0 },
    ]);
  };

  // Fetch user dashboard data
  const getDashboardData = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
      if (res.data) {
        setDashboardData(res.data);
        prepareChartData(res.data.charts || {});
      }
    } catch (err) {
      console.error("Error fetching user dashboard data:", err);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const handleSeeAll = () => navigate('/user/tasks');

  return (
    <DashboardLaylout activeMenu="Dashboard">
      {/* Greeting Card */}
      <div className="card my-5">
        <h2 className="text-xl md:text-2xl">Good Morning, {user?.name}</h2>
        <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
          {moment().format("dddd Do MMM YYYY")}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          <InfoCard
            label="Total Task"
            value={addThousandSeperator(dashboardData?.charts?.taskDistribution?.All || 0)}
            color="bg-primary"
          />
          <InfoCard
            label="Pending Task"
            value={addThousandSeperator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
            color="bg-violet-500"
          />
          <InfoCard
            label="In Progress Task"
            value={addThousandSeperator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
            color="bg-cyan-500"
          />
          <InfoCard
            label="Completed Task"
            value={addThousandSeperator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
            color="bg-lime-500"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="card w-full">
          <h5 className="font-medium mb-2">Task Distribution</h5>
          <CustomPieChart data={pieChartData} colors={COLORS} />
        </div>

        <div className="card w-full">
          <h5 className="font-medium mb-2">Task Priority Levels</h5>
          <CustomBarChart data={barChartData} />
        </div>

        {/* Recent Tasks */}
        <div className="md:col-span-2 card w-full overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <h5 className="text-lg font-medium">Recent Tasks</h5>
            <button className="card-btn" onClick={handleSeeAll}>
              See All <LuArrowRight className="text-base" />
            </button>
          </div>

          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </DashboardLaylout>
  );
};

export default UserDashboard;
