import React from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  onFilter,
  showFilter = false,
  className = ""
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="pl-10"
        />
      </div>
      {showFilter && (
        <Button
          variant="outline"
          size="icon"
          onClick={onFilter}
          className="shrink-0"
        >
          <ApperIcon name="Filter" className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;