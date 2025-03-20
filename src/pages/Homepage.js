import "./Common.css";
import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProgressChart } from "../components/ProgressChart";
import ContentImage from '../assets/images/content-img-1.jpg';
import ContentCardIcon from '../assets/images/content-card-icon-1.svg'

/**
 * Fetch all todo items.
 */
const getAllToDoItems = async () => {
  return (await axios.get("http://localhost:3001/items")).data;
};

/**
 * Homepage component with a pie chart.
 */
export const Homepage = () => {
  const [todoData, setTodoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getAllToDoItems();
        const totalTodos = items.length;
        const completedTodos = items.filter((item) => item.isComplete).length;
        const incompleteTodos = totalTodos - completedTodos;

        setTodoData([
          { name: "Completed", value: completedTodos },
          { name: "Incomplete", value: incompleteTodos },
        ]);
      } catch (error) {
        console.error("Failed to fetch todo items.", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="hero bg-base-200 mt-10">
        <div className="hero-content flex-col lg:flex-row-reverse">
          {/* Pie Chart Card */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <ProgressChart data={todoData} />
          </div>
          {/* Content Section */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-5xl font-bold">Organize your work and life, finally.</h1>
            <p className="py-6">
            Simplify life for both you and your team with the world’s #1 task manager and to-do list app.<br /><br />

            374K+ ★★★★★ reviews from Google Play
            </p>
            <a className="btn btn-primary" href="/todos">Start for free</a>
          </div>
        </div>
      </div>

      <section class="section-about mt-10">
              
                <div class="section-space">
          
                    <div class="container">
                      
                        <div class="grid grid-cols-1 items-center gap-10 md:gap-[60px] lg:grid-cols-[minmax(0,0.7fr)_1fr] lg:gap-20 xl:grid-cols-2 xxl:gap-28">
                           
                            <div class="relative order-2 overflow-hidden lg:order-1 jos" data-jos_animation="fade-right" data-jos_once="1" data-jos_timingfunction="ease" data-jos_duration="0.5" data-jos_delay="0.3" data-jos_counter="1">
                            <img 
                                    src={ContentImage} 
                                    alt="content-img-1" 
                                    width="593" 
                                    height="600" 
                                    className="h-full w-full object-cover" 
                                  />
                           
                                <div class="absolute bottom-6 left-6 z-20 h-[210px] w-[190px] bg-white px-5 py-8 shadow-customOne jos" data-jos_delay="1" data-jos_once="1" data-jos_animation="fade-up" data-jos_timingfunction="ease" data-jos_duration="0.5" data-jos_counter="1">
                                    <img src={ContentCardIcon}
                                     alt="content-card-icon-1" width="70" height="70" />
                                    <span class="mt-6 block text-xl">100% Customer Satisfaction</span>
                                </div>
                               
                                <div class="absolute inset-0 z-10 bg-colorDark/40"></div>
                            </div>
                            

                           
                            <div class="order-1 lg:order-2">
                           
                                <div class="mb-7">
                                    <h2 class="section-title right mb-6">Get started with exclusive features when you sign up!</h2>
                                    <p>
                                    We’re here to help you stay organized, productive, and on top of your tasks. Our app is designed 
                                    to simplify your life and boost your efficiency.
                                    </p>
                                </div>
                              

                            
                                <ul class="mb-10 flex flex-col gap-y-3 font-semibold">
                               
                                    <li>
                                        <span class="inline-block align-middle mr-2 text-colorBlue">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-blue-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </span>
                                        Track your progress with customizable task reports and dashboards.
                                    </li>
                            
                                    <li>
                                        <span class="inline-block align-middle mr-2 text-colorBlue">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-blue-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </span>
                                        Modernize your task management with our intuitive and powerful todo app.
                                    </li>
                                 
                                    <li>
                                        <span class="inline-block align-middle mr-2 text-colorBlue">
                                            <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-blue-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </span>
                                        A todo app built for everyone—individuals, teams, and businesses.
                                    </li>
                                 
                                </ul>
                             

                                <a class="btn btn-primary" href="/about">
                                    More About
                                    <span>
                                        <i class="ri-arrow-right-up-line"></i>
                                        <i class="ri-arrow-right-up-line"></i>
                                    </span>
                                </a>
                            </div>
                          
                        </div>
                      
                    </div>
                   
                </div>
               
            </section>

    </div>
  );
};
