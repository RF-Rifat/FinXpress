import { Button } from "../components/Button";

const Home = () => {
  return (
    <div>
      <Button type="submit" className="w-full" isLoading={false}>
        Login
      </Button>
    </div>
  );
};

export default Home;
