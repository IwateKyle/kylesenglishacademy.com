import { Component } from 'solid-js';
import { MainHeader } from './headers/header';
import { DefaultApp } from './default';
import { ABC3D } from './abc/abc.three.component';

const App: Component = () => {
  return (
    <>
      <MainHeader />
      <ABC3D></ABC3D>
      {/* <DefaultApp /> */}
    </>
  );
};

export default App;
