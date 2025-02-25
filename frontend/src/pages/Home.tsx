import { Button } from "../components/Button";

const Home = () => {
  return (
      <div className="flex flex-col gap-4 bg-amber-500 h-4">
     
      <Button type="submit" className="w-full" isLoading={false}>
        Login
      </Button>
    </div>
  );
};

export default Home;
