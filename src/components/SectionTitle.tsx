import React from 'react';

interface Props {
  title: string;
}

const SectionTitle: React.FC<Props> = ({ title }) => (
  <h2 className="text-xl font-bold mb-4 text-center text-gray-800">{title}</h2>
);

export default SectionTitle;
