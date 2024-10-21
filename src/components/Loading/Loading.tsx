import ReactLoading from 'react-loading';

import Modal from '../Modal/Modal';

const Loading = () => {
  return (
    <Modal zIndex={99999}>
      <ReactLoading type="spin" color="#86BD2C" height="25px" width="25px" />
    </Modal>
  );
};

export default Loading;
