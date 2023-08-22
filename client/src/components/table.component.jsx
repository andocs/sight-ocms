import React from 'react';

const ReusableTable = ({ data, columns, actions }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  return (
    <div className="w-full rounded-t-lg rounded-b-xl overflow-hidden">
      <table className='w-full'>
        
        <thead className='bg-sky-800 text-white p-4 header-shadow relative z-20 text-left'>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className='px-6 py-3'>
                {column.header}
              </th>
            ))}
            <th className='px-6 py-3 text-center' style={{ width: `${120 / (columns.length + 1)}%` }}>Actions</th>
          </tr>
        </thead>

        <tbody className="bg-cyan-100 text-sky-800 p-4 relative z-0 text-left">
          {data.map((item, index) => (
            <tr key={index} className='hover:bg-cyan-50'>  
              {columns.map((column, innerIndex) => (
                <td key={innerIndex} className={`px-6 py-4 ${column.field === 'role' ? 'capitalize' : ''}`}>{item[column.field]}</td>
              ))}
              <td className='px-6 py-4 flex space-x-2'>
                {actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    onClick={() => action.handler(item)}
                    className="flex-1 bg-white rounded-lg shadow-lg truncate"
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default ReusableTable;
