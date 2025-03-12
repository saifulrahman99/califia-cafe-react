import {useState} from 'react'
function App() {
    const [count, setCount] = useState(0)
    return (
        <>
            <div className="flex h-screen items-center justify-center bg-blue-500 text-white text-3xl font-bold">
                Hello, Tailwind with React + Vite! 🚀
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
            </div>
        </>
    )
}

export default App
