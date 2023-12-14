import { Footer, Navbar } from '../components';
import { About, Hero } from '../sections';

const Page = () => (
  <div className= "bg-light-blue overflow-hidden">
    <Navbar />
    <Hero />
    <div className="relative">
      <About />
      <div className="gradient-03 z-0" />
    </div>
    <Footer />
  </div>
);

export default Page;
