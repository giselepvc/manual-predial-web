import React from 'react';
import { CaptersDatum } from '@/interfaces/manual';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { Files, Main, Title, Chapter } from './styles';

interface ComponentToPrintProps {
  chapter: RecursiveNormalize<CaptersDatum[]> | undefined;
}

const DocComponent = React.forwardRef<HTMLDivElement, ComponentToPrintProps>(
  ({ chapter }, ref) => (
    <Files ref={ref}>
      <Main>
        {chapter
          ?.filter(item => item.visible)
          ?.sort((a, b) => a.order - b.order)
          ?.map(item => (
            <>
              <Chapter>{item.title}</Chapter>

              {item.titles
                ?.filter(item => item.visible)
                ?.sort((a, b) => a.order - b.order)
                ?.map(title => (
                  <Title>{title.title}</Title>
                ))}
            </>
          ))}
      </Main>
    </Files>
  ),
);

export default DocComponent;
