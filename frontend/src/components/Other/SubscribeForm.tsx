import React from 'react';

const SubscribeForm: React.FC = () => {
    return (
        <div>
            <form className="flex">
                <input
                    type="email"
                    placeholder="Email Address"
                    className="border border-gray-200 p-2.5 rounded-l flex-1 focus:outline-none focus:border-primary"
                />
                <input
                    type="submit"
                    value="Subscribe"
                    className="bg-primary text-white py-3.25 px-11.25 rounded-r cursor-pointer hover:bg-red-700 transition-all duration-300"
                />
            </form>
        </div>
    )
};

export default SubscribeForm;