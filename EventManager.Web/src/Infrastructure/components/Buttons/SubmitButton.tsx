import './SubmitButton.css';

interface SubmitButtonProps {
  isSubmitting: boolean;
  text: string;
  className?: string;
}
export function SubmitButton(props: SubmitButtonProps) {
  const { className, text, isSubmitting } = props;

  return (
    <div className={className}>
      <button
        type="submit"
        className={`_submit-btn ${isSubmitting ? 'loading' : ''}`}
      >
        {text}
      </button>
    </div>
  );
}
