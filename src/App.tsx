/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Circle, Plus, Trash2, X } from "lucide-react";
import React, { useState, useEffect } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("focusdo-tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    localStorage.setItem("focusdo-tasks", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-slate-900 selection:bg-slate-200">
      <div className="mx-auto max-w-lg px-6 py-12 md:py-20">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h1 id="app-title" className="text-4xl font-light tracking-tight text-slate-900">
                FocusDo
              </h1>
              <p className="text-sm text-slate-500 font-medium tracking-wide uppercase mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-light text-slate-400">
                {completedCount}<span className="text-slate-200 mx-1">/</span>{todos.length}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-slate-900"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        </header>

        {/* Input Section */}
        <form onSubmit={addTodo} className="relative mb-10 group">
          <input
            id="todo-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-white border-none rounded-2xl py-5 pl-6 pr-16 shadow-sm focus:ring-2 focus:ring-slate-900/5 transition-all placeholder:text-slate-300 text-lg"
          />
          <button
            id="add-button"
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-slate-900 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        </form>

        {/* List Section */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {todos.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl"
              >
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-slate-300" size={32} />
                </div>
                <h3 className="text-slate-400 font-medium">All caught up</h3>
                <p className="text-slate-300 text-sm mt-1">Enjoy your day!</p>
              </motion.div>
            ) : (
              todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30, opacity: { duration: 0.2 } }}
                  className={`group flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-transparent hover:border-slate-100 transition-all ${todo.completed ? 'opacity-60' : ''}`}
                >
                  <button
                    id={`toggle-${todo.id}`}
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 transition-colors ${todo.completed ? 'text-slate-900' : 'text-slate-200 group-hover:text-slate-400'}`}
                  >
                    {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <span 
                    className={`flex-grow text-lg transition-all duration-300 ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}
                  >
                    {todo.text}
                  </span>

                  <button
                    id={`delete-${todo.id}`}
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        {todos.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
              Stay Focused • Keep Moving
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

