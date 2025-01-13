const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs').promises;

chai.use(chaiHttp);
let baseUrl;

describe('Resource API', () => {
    before(async () => {
        const { address, port } = server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    });

    after(() => {
        return new Promise((resolve) => {
            if (server && server.listening) {
                server.close(() => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    });

    let initialCount = 0;

    // Test Suite for viewing resources
    describe('GET /view-resources', () => {
        it('should return all resources', (done) => {
            chai.request(baseUrl)
                .get('/view-resources')
                .end((err, res) => {
                    if (err) done(err);
                    initialCount = res.body.length;
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });

        it('should handle missing resources file gracefully', async () => {
            const path = 'utils/blogs.json';
            const backupPath = 'utils/blogs_backup.json';

            try {
                // Temporarily rename the file
                await fs.rename(path, backupPath);

                // Make the GET request
                const res = await chai.request(baseUrl).get('/view-resources');
                expect(res).to.have.status(500);
                expect(res.body.message).to.include('ENOENT');
            } catch (error) {
                throw error;
            } finally {
                // Restore the file
                await fs.rename(backupPath, path);
            }
        });
    });

    // Test Suite for adding resources
    describe('POST /add-resource', () => {
        it('should return 500 for invalid inputs', (done) => {
            chai.request(baseUrl)
                .post('/add-resource')
                .send({
                    title: '',
                    content: 'Too short',
                    author: 'invalid-email',
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(500);
                    expect(res.body.message).to.be.a('string');
                    done();
                });
        });

        it('should add a new resource with valid inputs', (done) => {
            chai.request(baseUrl)
                .post('/add-resource')
                .send({
                    title: 'Valid Resource',
                    content: 'A proper description',
                    author: 'test@example.com',
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(initialCount + 1);
                    done();
                });
        });
    });
});
