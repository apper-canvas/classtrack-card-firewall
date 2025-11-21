import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
          </div>
          
          {/* Error Message */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          {/* Actions */}
          <div className="space-y-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <ApperIcon name="RefreshCw" className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-gray-50"
            >
              Refresh Page
            </button>
          </div>
          
          {/* Help Text */}
          <p className="text-sm text-gray-500 mt-6">
            If the problem persists, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;