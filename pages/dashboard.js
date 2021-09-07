import PrivateRoute from '../components/PrivateRoute';

export default function Dashboard() {
  return (
    <PrivateRoute>
      <div>dashboard</div>
    </PrivateRoute>
  );
}
