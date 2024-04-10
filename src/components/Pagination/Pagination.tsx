/* eslint-disable react/jsx-wrap-multilines */
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import { PaginationContainer, PaginationSection } from './styles';

const Pagination = (props: ReactPaginateProps) => {
  return (
    <PaginationSection>
      <PaginationContainer>
        <ReactPaginate
          nextLabel={
            <>
              Próximo
              <span> {'>'}</span>
            </>
          }
          previousLabel={
            <>
              <span> {'<'}</span>
              Anterior
            </>
          }
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          {...props}
        />
      </PaginationContainer>
    </PaginationSection>
  );
};

export default Pagination;
