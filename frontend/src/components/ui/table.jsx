import React from 'react';

const Table = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      />
    </div>
  );
});
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className = '', ...props }, ref) => {
  return <thead ref={ref} className={`border-b ${className}`} {...props} />;
});
TableHeader.displayName = 'TableHeader';

const TableRow = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}
      {...props}
    />
  );
});
TableRow.displayName = 'TableRow';

const TableCell = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
});
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableRow, TableCell };