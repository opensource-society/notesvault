// Example button component to demonstrate path aliases
interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} style={{ padding: '8px 16px' }}>
      {label}
    </button>
  );
};
