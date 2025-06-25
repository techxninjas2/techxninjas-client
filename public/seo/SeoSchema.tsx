import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoSchemaProps {
  schema: Record<string, any> | Record<string, any>[];
}

const SeoSchema: React.FC<SeoSchemaProps> = ({ schema }) => {
  const schemaString = JSON.stringify(schema);
  
  return (
    <Helmet>
      <script type="application/ld+json">{schemaString}</script>
    </Helmet>
  );
};

export default SeoSchema;