const Project8 = ({ isFullscreen = false }) => {
  return (
    <div className={`w-full ${isFullscreen ? 'h-screen' : 'h-[600px]'} bg-gray-50 flex items-center justify-center`}>
      <div className="text-center">
        <p className="text-lg text-gray-500 font-poppins mb-2">Projeto 8</p>
        <p className="text-sm text-gray-400 font-poppins">Aguardando implementação...</p>
      </div>
    </div>
  );
};

export default Project8;
