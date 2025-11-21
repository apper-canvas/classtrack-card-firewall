import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* 404 Illustration */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="BookX" className="w-10 h-10 text-primary-600" />
          </div>
          
          {/* Error Content */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-gray-200 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-600">
              Oops! The page you're looking for seems to have wandered off to a different class.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            >
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          {/* Help Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Need help finding something?</p>
            <div className="flex justify-center space-x-4 text-sm">
              <button
                onClick={() => navigate("/students")}
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Students
              </button>
              <button
                onClick={() => navigate("/grades")}
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Grades
              </button>
              <button
                onClick={() => navigate("/attendance")}
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Attendance
              </button>
              <button
                onClick={() => navigate("/reports")}
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;