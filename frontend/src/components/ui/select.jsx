import React from 'react';

const SelectGroup = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <optgroup ref={ref} className={`bg-background ${className}`} {...props}>
      {children}
    </optgroup>
  );
});
SelectGroup.displayName = 'SelectGroup';

const SelectItem = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <option
      ref={ref}
      className={`relative flex w-full cursor-default select-none items-center py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </option>
  );
});
SelectItem.displayName = 'SelectItem';

const SelectLabel = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={`py-1.5 pl-8 pr-2 text-sm font-semibold ${className}`}
      {...props}
    >
      {children}
    </label>
  );
});
SelectLabel.displayName = 'SelectLabel';

const SelectSeparator = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`-mx-1 my-1 h-px bg-muted ${className}`}
      {...props}
    />
  );
});
SelectSeparator.displayName = 'SelectSeparator';

const Select = React.forwardRef(({ className = '', error = false, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`flex h-10 w-full rounded-md border ${
        error ? 'border-red-500' : 'border-input'
      } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});
Select.displayName = 'Select';

const SelectTrigger = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

export {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
};