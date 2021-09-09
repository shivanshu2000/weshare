import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Spinner({ color = '#0c4370', size = '2x' }) {
  return (
    <FontAwesomeIcon
      spin
      style={{ color: color }}
      icon={faSpinner}
      size={size}
    />
  );
}
