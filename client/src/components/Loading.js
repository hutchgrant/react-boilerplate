import React from 'react';

export default({isLoading, error}) => {
    // Handle the loading state
    if (isLoading) {
      return <div>Loading...</div>;
    }
    // Handle the error state
    else if (error) {
      return (
          <div className="text-center">
            <h1>Error 404</h1>
            <h3>Page Not Found</h3>
            <p>Sorry the page you're looking for either doesn't exist or has moved.</p>
          </div>
      );
    }
    else {
      return null;
    }
};