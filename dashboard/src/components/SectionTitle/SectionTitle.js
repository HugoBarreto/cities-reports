import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Col } from 'shards-react';

const SectionTitle = ({ title, className, ...attrs }) => {
  const classes = classNames(
    className,
    'text-center',
    'text-md-left',
    'mb-sm-0'
  );

  return (
    <Col xs="12" sm="4" className={classes} {...attrs}>
      <h4 className="">{title}</h4>
    </Col>
  );
};

SectionTitle.propTypes = {
  title: PropTypes.string,
};

SectionTitle.defaultProps = {
  title: '',
};

export default SectionTitle;
