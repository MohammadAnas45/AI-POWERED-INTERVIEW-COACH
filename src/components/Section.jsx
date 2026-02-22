import React from 'react';

// Reusable Section Component
const Section = ({ title, subtitle, children, id, className = "" }) => {
    return (
        <section id={id} className={`py-16 sm:py-24 ${className}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center mb-16">
                    {subtitle && (
                        <h2 className="text-base font-semibold leading-7 text-indigo-400">
                            {subtitle}
                        </h2>
                    )}
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {title}
                    </p>
                </div>

                <div className="mx-auto max-w-2xl lg:max-w-none">
                    {children}
                </div>
            </div>
        </section>
    );
};

export default Section;
