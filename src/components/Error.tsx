const Error = ({ error }: { error: string }) => {
  return (
    <div className="font-semibold text-base text-red-500">Error: {error}</div>
  );
};

export default Error;
