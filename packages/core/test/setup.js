/* eslint-disable @typescript-eslint/no-var-requires */
const chai = require('chai')
const { initSnapshotManager } = require('mocha-chai-jest-snapshot')

chai.use(initSnapshotManager)
