import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MergeSortVisualizer from "./common/MergeSortVisualizer.tsx";
import QuickSortVisualizer from "./common/Qsort.tsx";
import BubbleSortVisualizer from "./common/Bsort.tsx";
import BinarySearchVisualizer from "./common/binerysearch.tsx";
import LinearSearchVisualizer from "./common/Linearsearch.tsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"; // added import

function App() {
  return (
    <>
      <div>
        

        <Tabs defaultValue="Main" className="w-[100%]">
              <h1 className="text-xl font-bold mb-2">Algorithm Design Course</h1>

          <TabsList>
            <TabsTrigger  className="m-2" value="Main">Main</TabsTrigger>
            <TabsTrigger className="m-2" value="MergeSortVisualizer">
              Merge Sort Visualizer
            </TabsTrigger>
            <TabsTrigger className="m-2" value="BubbleSortVisualizer">
              Bubble Sort Visualizer
            </TabsTrigger>
            <TabsTrigger className="m-2" value="QuickSortVisualizer">
              Quick Sort Visualizer
            </TabsTrigger>
            <TabsTrigger className="m-2" value="BinarySearchVisualizer">
              Binary Search Visualizer
            </TabsTrigger>
            <TabsTrigger className="m-2" value="LinearSearchVisualizer">
              Linear Search Visualizer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Main">
           
              <h3 className="text-md mb-1">Instructor: Dr. Jamalian</h3>
              <h3 className="text-md mb-1">Student: Arta Fallahpour</h3>
              <h3 className="text-md mt-3">
                <a
                  href="https://github.com/artafps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:underline"
                >
                  Powered by : artafps
                </a>
              </h3>
            <h3>Vite + React</h3>

               <div className="flex justify-center">
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
          </TabsContent>
          <TabsContent value="MergeSortVisualizer">
            <MergeSortVisualizer></MergeSortVisualizer>
          </TabsContent>
          <TabsContent value="BubbleSortVisualizer">
             <BubbleSortVisualizer></BubbleSortVisualizer>
          </TabsContent>
          <TabsContent value="QuickSortVisualizer">
            <QuickSortVisualizer></QuickSortVisualizer>
          </TabsContent>
          <TabsContent value="BinarySearchVisualizer">
            <BinarySearchVisualizer></BinarySearchVisualizer> 
          </TabsContent>
          <TabsContent value="LinearSearchVisualizer">
            <LinearSearchVisualizer></LinearSearchVisualizer>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default App;
