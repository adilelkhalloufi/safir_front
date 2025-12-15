import { ImSpinner2 } from 'react-icons/im';

const defaultSpinner = (
  <ImSpinner2 className="animate-spin text-4xl mx-auto" />);


export interface LoaderProps {
  text?: string;
  spinner?: React.ReactNode;
}

const Loader = ({
  text = 'LOADING',
  spinner = defaultSpinner,
}: LoaderProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col opacity-50">
        {spinner}
        {text && <span className="mt-4 text-lg tracking-widest">{text}</span>}
      </div>
    </div>
  );
};

export default Loader;
