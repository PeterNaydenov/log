import { defineConfig } from 'vitest/config'

export default defineConfig ({
        test: {
                globals: true,
                include: [ 'test/**/*.test.js' ],
                coverage: {
                        include: [ 'src/**/*.js' ],
                        exclude: [ 'node_modules', 'test' ],
                        reporter: [ 'lcov', 'text-summary' ]
                }
        }
})
