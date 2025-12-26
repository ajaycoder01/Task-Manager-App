
import React, { useContext, useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLaylout from '../../components/layouts/DashboardLaylout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';

import InfoCard from '../../components/Cards/InfoCard';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

const COLORS = ["#8D51FF", "#00B80B", "#7BCE00"];

function Dashboard() {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  //  FIXED
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

  const getDashboardData = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      setDashboardData(res.data);
      prepareChartData(res.data.charts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLaylout activeMenu="Dashboard">

      <div className='card my-5'>
        <h2 className='text-xl md:text-2xl'>Good Morning! {user?.name}</h2>
        <p className='text-xs text-gray-400'>{moment().format("dddd Do MMM YYYY")}</p>

        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5'>
          <InfoCard label="Total Task" value={dashboardData?.charts?.taskDistribution?.All || 0} />
          <InfoCard label="Pending Task" value={dashboardData?.charts?.taskDistribution?.Pending || 0} />
          <InfoCard label="In Progress Task" value={dashboardData?.charts?.taskDistribution?.InProgress || 0} />
          <InfoCard label="Completed Task" value={dashboardData?.charts?.taskDistribution?.Completed || 0} />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='card w-full overflow-hidden'>
           <h5 className='font-medium'>Task Disribution</h5>
          <CustomPieChart data={pieChartData} colors={COLORS} />
        </div>

        <div className='card w-full overflow-hidden'>
          <h5 className='font-medium'>Task Priority Levels</h5>
          <CustomBarChart data={barChartData} />
        </div>

        <div className='md:col-span-2 card w-full overflow-x-auto'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
            <h5>Recent Tasks</h5>
            <button className='card-btn' onClick={() => navigate('/admin/tasks')}>
              See All <LuArrowRight />
            </button>
          </div>

          <div className='mt-3 w-full overflow-x-auto'>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>

    </DashboardLaylout>
  );
}

export default Dashboard;
