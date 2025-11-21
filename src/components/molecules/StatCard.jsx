import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "positive",
  iconColor = "text-primary-600",
  iconBg = "bg-primary-100"
}) => {
  const changeColor = changeType === "positive" ? "text-green-600" : "text-red-600";
  const changeIcon = changeType === "positive" ? "TrendingUp" : "TrendingDown";

  return (
    <Card hover className="stat-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center space-x-1 text-sm ${changeColor}`}>
                <ApperIcon name={changeIcon} className="w-4 h-4" />
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
            <ApperIcon name={icon} className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;