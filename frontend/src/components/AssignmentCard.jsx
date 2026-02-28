import { Link } from 'react-router-dom';

const DIFF_COLORS = {
    easy: 'var(--color-easy, #22d3a8)',
    medium: 'var(--color-medium, #f5a623)',
    hard: 'var(--color-hard, #f4607a)',
};

function AssignmentCard({ assignment, isCompleted }) {
    const { _id, title, description, difficulty, expected_concepts } = assignment;

    return (
        <Link
            to={`/assignment/${_id}`}
            className={`assignment-card ${isCompleted ? 'assignment-card--completed' : ''}`}
            style={{ '--diff-color': DIFF_COLORS[difficulty] }}
            aria-label={`Open assignment: ${title}`}
        >
            <div className="assignment-card__header">
                <h2 className="assignment-card__title">
                    {title}
                    {isCompleted && <span className="assignment-card__check" title="Completed">✅</span>}
                </h2>
                <span className={`assignment-card__badge assignment-card__badge--${difficulty}`}>
                    {difficulty}
                </span>
            </div>

            <p className="assignment-card__description">
                {description.length > 120 ? description.slice(0, 120) + '…' : description}
            </p>

            <div className="assignment-card__footer">
                <div className="assignment-card__concepts">
                    {expected_concepts?.slice(0, 3).map((c) => (
                        <span key={c} className="assignment-card__concept-tag">{c}</span>
                    ))}
                    {expected_concepts?.length > 3 && (
                        <span className="assignment-card__concept-tag">+{expected_concepts.length - 3}</span>
                    )}
                </div>
                <span className="assignment-card__arrow">→</span>
            </div>
        </Link>
    );
}

export default AssignmentCard;
