'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CourseCard } from '@/components/learning/CourseCard';
import { courses, browseCategories } from '@/lib/learning-data';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function BrowsePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredCourses = useMemo(() => {
        let result = courses;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (c) =>
                    c.title.toLowerCase().includes(query) ||
                    c.category.toLowerCase().includes(query) ||
                    c.instructor.toLowerCase().includes(query)
            );
        }
        if (selectedCategory) {
            result = result.filter((c) => c.category === selectedCategory);
        }
        return result;
    }, [searchQuery, selectedCategory]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-gray-900">Browse</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Discover courses and topics to accelerate your career.
                </p>
            </motion.div>

            {/* Search & Filter */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search courses, skills, or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 bg-white border-gray-200 text-sm rounded-lg focus-visible:ring-[#0a66c2]"
                    />
                </div>
                {selectedCategory && (
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-xs text-[#0a66c2] font-medium hover:underline self-center"
                    >
                        Clear filter ✕
                    </button>
                )}
            </motion.div>

            {/* Categories Grid */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Topics</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {browseCategories.map((cat, idx) => (
                        <motion.button
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.03, duration: 0.3 }}
                            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${selectedCategory === cat.name
                                    ? 'border-[#0a66c2] bg-[#e8f1fd] shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                }`}
                        >
                            <span className="text-2xl">{cat.icon}</span>
                            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                                {cat.name}
                            </span>
                            <span className="text-[10px] text-gray-400">{cat.count} courses</span>
                        </motion.button>
                    ))}
                </div>
            </motion.section>

            {/* All Courses */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {selectedCategory ? `${selectedCategory} Courses` : 'All Courses'}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        ({filteredCourses.length} results)
                    </span>
                </h2>
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredCourses.map((course, idx) => (
                            <CourseCard key={course.id} course={course} index={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-sm">No courses found matching your criteria.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
