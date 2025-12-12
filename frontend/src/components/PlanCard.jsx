import { Link } from 'react-router-dom';
import { getPlanPrice, formatPrice } from '../utils/planPricing';
import { GlassReflection } from './animations';

const PlanCard = ({ 
  plan, 
  isPopular = false,
  billingPeriod = 'monthly',
  showDescription = true,
  showFeatures = true,
  showFullFeatures = false,
  variant = 'default', // 'default' ou 'compact'
  buttonLink = null, // Se fornecido, usa este link ao invés do checkout padrão
  enableRotateAnimation = false, // Animação de rotação ao hover (apenas na home)
  activeSubscription = null // Assinatura ativa do usuário
}) => {
  const priceInfo = getPlanPrice(plan.id, billingPeriod, plan);
  const displayPrice = billingPeriod === 'annual' && priceInfo.installments 
    ? priceInfo.installments.monthly 
    : (priceInfo.price || plan.price || 0);
  const showAnnualInfo = billingPeriod === 'annual' && (plan.price > 0 || plan.priceAnnual) && priceInfo.installments;
  const isFeatured = plan.featured && !isPopular;
  const isEnterprise = plan.id === 'team';

  // Verificar se este é o plano ativo do usuário
  const isCurrentPlan = activeSubscription && activeSubscription.status === 'active' && activeSubscription.plan_type === plan.id;

  // Hierarquia dos planos (quanto maior o número, melhor o plano)
  const planHierarchy = {
    free: 0,
    classic: 1,
    pro: 2,
    team: 3
  };

  // Verificar se este plano é um upgrade do plano atual
  const isUpgrade = activeSubscription && 
                    activeSubscription.status === 'active' && 
                    planHierarchy[plan.id] > planHierarchy[activeSubscription.plan_type];

  // Determinar o texto e comportamento do botão
  const getButtonContent = () => {
    if (isCurrentPlan) {
      return 'Seu Plano Atual';
    }
    if (isUpgrade) {
      return 'Upgrade';
    }
    if (plan.freeTrial) {
      return `Teste ${plan.freeTrialDays} Dias Grátis`;
    }
    if (plan.price === 0) {
      return 'Começar Grátis';
    }
    return 'Escolher Plano';
  };

  return (
    <div className="relative">
      {/* Tags acima do card */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <span className="bg-brand-green text-brand-blue-900 px-4 py-1 rounded-full text-sm font-semibold font-poppins font-medium shadow-md">
            Mais Popular
          </span>
        </div>
      )}
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <span className="bg-brand-green text-brand-blue-900 px-4 py-1 rounded-full text-sm font-semibold font-poppins font-medium shadow-md">
            Recomendado
          </span>
        </div>
      )}
      
      <div className={`rounded-lg shadow-lg h-full flex flex-col overflow-hidden relative ${
        isPopular 
          ? 'bg-brand-white border-2 border-brand-green shadow-xl pt-8 pb-6 px-6' 
          : isFeatured 
          ? 'border-2 border-brand-green/30 shadow-2xl backdrop-blur-sm pt-8 pb-6 px-6' 
          : isEnterprise
          ? 'bg-brand-white border border-brand-blue-900 p-6'
          : 'bg-brand-white border-2 border-gray-200 p-6'
      } ${enableRotateAnimation ? 'hover:rotate-2 transition-transform duration-300' : ''}`} style={{ 
        zIndex: 2,
        ...(isFeatured ? {
          background: 'radial-gradient(circle at center, #0d2338 0%, #011526 100%)'
        } : {})
      }}>
        {/* Textura de ruído para MBuddy Team */}
        {isEnterprise && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15' fill='%23e5e7eb'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              mixBlendMode: 'multiply'
            }}
          />
        )}
        {/* Reflexo de vidro animado - apenas para featured */}
        {isFeatured && (
          <GlassReflection
            speed="4s"
            opacity={0.25}
            angle="135deg"
          />
        )}
        
        <div className={`text-center mb-6 relative z-20 ${isFeatured ? 'text-brand-white' : ''}`}>
          <h3 className={`text-2xl font-black mb-2 font-poppins ${isFeatured ? 'text-brand-white' : 'text-brand-blue-900'}`}>
            {plan.name}
          </h3>
          
          {showDescription && (
            <p className={`text-sm mb-4 font-poppins ${isFeatured ? 'text-gray-200' : 'text-gray-600'}`}>
              {plan.description}
            </p>
          )}
          
          <div className="mb-4">
            <div className="flex items-baseline justify-center gap-1">
              <span className={`text-4xl font-bold font-poppins font-medium ${isFeatured ? 'text-brand-white' : 'text-brand-blue-900'}`}>
                R$ {formatPrice(displayPrice)}
              </span>
              <span className={`font-poppins ${isFeatured ? 'text-gray-300' : 'text-gray-600'}`}>/mês</span>
            </div>
            {billingPeriod === 'annual' && priceInfo.discountPercentage && (
              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold font-poppins ${isFeatured ? 'text-brand-green' : 'text-brand-green'}`}>
                  Economize {priceInfo.discountPercentage.toFixed(1)}% no plano anual
                </p>
              </div>
            )}
          </div>
        </div>

        {showFeatures && (
          <ul className={`space-y-3 mb-6 flex-grow relative z-20 ${variant === 'compact' ? 'space-y-2' : ''}`}>
            {(showFullFeatures ? plan.features : plan.features.slice(0, variant === 'compact' ? 2 : plan.features.length)).map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${isFeatured ? 'text-brand-green' : 'text-brand-green'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className={`font-poppins ${isFeatured ? 'text-gray-200' : 'text-gray-700'} ${variant === 'compact' ? 'text-sm' : ''}`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}

        {isCurrentPlan ? (
          <button
            disabled
            className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors font-poppins font-medium mt-auto relative z-20 cursor-not-allowed opacity-75 ${
              isPopular || plan.freeTrial
                ? 'bg-brand-green text-brand-blue-900'
                : isFeatured
                ? 'bg-brand-green text-brand-blue-900 shadow-lg'
                : isEnterprise
                ? 'bg-brand-blue-900 text-brand-white'
                : 'bg-gray-100 text-brand-blue-900'
            }`}
          >
            {getButtonContent()}
          </button>
        ) : (
        <Link
          to={buttonLink || `/plans/${plan.id}/checkout`}
          state={buttonLink ? undefined : { billingPeriod }}
          className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors font-poppins font-medium mt-auto relative z-20 ${
            isPopular || plan.freeTrial
              ? 'bg-brand-green text-brand-blue-900 hover:bg-brand-green-500'
              : isFeatured
              ? 'bg-brand-green text-brand-blue-900 hover:bg-brand-green-500 shadow-lg'
              : isEnterprise
              ? 'bg-brand-blue-900 text-brand-white hover:bg-brand-blue-800'
              : 'bg-gray-100 text-brand-blue-900 hover:bg-gray-200'
          }`}
        >
            {getButtonContent()}
        </Link>
        )}
      </div>
    </div>
  );
};

export default PlanCard;
