const QRCode = ({ qrCodeDataURL }) => {
  if (!qrCodeDataURL) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Gerando QR Code...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg">
      <img 
        src={qrCodeDataURL} 
        alt="QR Code Pix" 
        className="border-2 border-gray-300 rounded-lg"
      />
      <p className="mt-4 text-sm text-gray-600 text-center max-w-xs">
        Escaneie o QR Code com o app do seu banco para pagar via Pix
      </p>
    </div>
  );
};

export default QRCode;

