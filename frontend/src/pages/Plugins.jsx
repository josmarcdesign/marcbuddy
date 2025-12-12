import { Plug, Shield, DownloadCloud, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const Plugins = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 text-brand-blue-900 font-semibold text-xs sm:text-sm">
            <Plug className="w-4 h-4" />
            Plugins oficiais
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-brand-blue-900 font-nunito">
            Plugins para seu fluxo de criação
          </h1>
          <p className="mt-3 text-gray-600 font-poppins max-w-2xl mx-auto">
            Integre o MarcBuddy diretamente nas suas ferramentas de design. Começamos pelo Adobe Illustrator e vamos expandir para outras plataformas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Adobe Illustrator */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Layers className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-blue-900 font-nunito">Adobe Illustrator</h2>
                <p className="text-sm text-gray-600 font-poppins">Extensão oficial para agilizar assets e cores.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-poppins">Compatibilidade</p>
                <p className="text-sm text-brand-blue-900 font-semibold mt-1 font-nunito">CC 2021+</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-poppins">Status</p>
                <p className="text-sm text-amber-700 font-semibold mt-1 font-nunito">Em beta interno</p>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-gray-700 font-poppins">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-brand-green mt-0.5" />
                Gerencie cores, paletas e bibliotecas aprovadas direto no Illustrator.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-brand-green mt-0.5" />
                Exporte assets otimizados mantendo padrões da marca.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-brand-green mt-0.5" />
                Integração com seu workspace MarcBuddy para referências rápidas.
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue-900 text-white font-semibold font-poppins shadow-sm hover:bg-brand-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled
              >
                <DownloadCloud className="w-4 h-4" />
                Download em breve
              </button>
              <Link
                to="/plans"
                className="text-sm font-semibold text-brand-blue-900 hover:text-brand-green font-poppins"
              >
                Ver planos para plugins
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plugins;

