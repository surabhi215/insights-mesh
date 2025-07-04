export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Insights Mesh</h1>
      <p className="text-lg text-gray-700 mb-8">
        This is the home page of the Insights Mesh application.
      </p>
      <a
        href="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </a>
    </div>
  );
};
