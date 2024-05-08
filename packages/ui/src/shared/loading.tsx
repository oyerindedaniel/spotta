import { ImSpinner8 } from "react-icons/im";

export const Loading = ({
  size = "24",
  description,
}: {
  size?: string;
  description?: string;
}) => {
  return (
    <div className="text-brand-blue dark:text-white flex items-center justify-center flex-col gap-2">
      <ImSpinner8
        className="animate-spin"
        size={`${size}px`}
        fill="currentColor"
      />
      {description && <p className="text-base font-medium">{description}</p>}
    </div>
  );
};
