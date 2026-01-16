import type { RecommendedModule } from '../../types';
import './discovery.css';

interface ModuleRecommendationCardProps {
  module: RecommendedModule;
  showWhySuggested?: boolean;
}

export function ModuleRecommendationCard({
  module,
  showWhySuggested = true,
}: ModuleRecommendationCardProps) {
  const getWhySuggestedText = () => {
    if (module.whySuggested.type === 'default-starter') {
      return module.whySuggested.industryName
        ? `Common starting point for ${module.whySuggested.industryName}`
        : 'Common starting point for your business type';
    }

    if (module.whySuggested.type === 'padding') {
      return 'Related to your selected touchpoints';
    }

    if (module.whySuggested.triggeringQuestionTexts.length > 0) {
      return module.whySuggested.triggeringQuestionTexts.join('; ');
    }

    return 'Based on your selections';
  };

  return (
    <div className="module-recommendation-card">
      <div className="module-card-header">
        <div>
          <h4 className="module-card-title">{module.moduleName}</h4>
          <p className="module-card-time">{module.estimatedTime} min</p>
        </div>
      </div>

      {showWhySuggested && (
        <div className="why-suggested">
          <p className="why-suggested-label">Why suggested</p>
          <p className="why-suggested-text">{getWhySuggestedText()}</p>
        </div>
      )}
    </div>
  );
}
