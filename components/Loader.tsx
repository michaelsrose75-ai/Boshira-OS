
import React from 'react';

interface LoaderProps {
  small?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ small = false }) => {
  const sizeClass = small ? 'h-6 w-6' : 'h-12 w-12';
  const borderClass = small ? 'border-2' : 'border-4';

  return (
    <div className={`flex justify-center items-center ${small ? '' : 'py-20'}`}>
      <div
        className={`${sizeClass} ${borderClass} border-t-indigo-500 border-gray-600 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;
