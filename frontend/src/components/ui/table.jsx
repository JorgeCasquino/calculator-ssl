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

const TableHead = React.forwardRef(({ className = '', ...props }, ref) => {
  return <th ref={ref} className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground ${className}`} {...props} />;
});
TableHead.displayName = 'TableHead';

const TableHeader = React.forwardRef(({ className = '', ...props }, ref) => {
  return <thead ref={ref} className={`border-b ${className}`} {...props} />;
});
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className = '', ...props }, ref) => {
  return <tbody ref={ref} className={`${className}`} {...props} />;
});
TableBody.displayName = 'TableBody';

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
      className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
});
TableCell.displayName = 'TableCell';

export { 
  Table, 
  TableHeader, 
  TableHead,
  TableBody, 
  TableRow, 
  TableCell 
};