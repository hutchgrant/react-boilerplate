import React from 'react';
import { Link } from 'react-router-dom';

export default ({
  input,
  type,
  label,
  value,
  btn,
  meta: { error, touched, invalid }
}) => {
  if (type === 'checkbox') {
    return (
      <div className="agreement">
        <label>
          <input {...input} type={type} name={input.name} /> {label}
          <Link to="/terms-of-service" className="text-danger">
            {' '}
            terms of service agreement
          </Link>
        </label>
        <div className="text-danger" style={{ marginBottom: '20px' }}>
          {touched && error}
        </div>
      </div>
    );
  }

  const renderInputGroup = () => {
    if (btn) {
      return (
        <div className="input-group">
          <input
            {...input}
            value={input.value}
            type={type}
            className="form-control"
            placeholder={label}
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">
              Recover!
            </button>
          </span>
        </div>
      );
    } else {
      return (
        <input
          {...input}
          value={input.value}
          type={type}
          className="form-control"
          style={{ marginBottom: '5px' }}
          placeholder={label}
        />
      );
    }
  };

  return (
    <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
      {renderInputGroup()}
      <div className="text-danger" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
};
