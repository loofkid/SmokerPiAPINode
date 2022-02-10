import typescript from 'rollup-plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import externals from 'rollup-plugin-node-externals';

const production = !process.env.ROLLUP_WATCH;
const local = process.env.LOCAL === 'true';


const startNode = () => {
    let started = false;
    return {
        writeBundle() {
            if (!started) {
                started = true;
                require('child_process').spawn('yarn', ['nodemon', '--delay 3', '--watch src', '--watch dist', '--ignore dist/configs', '--inspect=0.0.0.0:9229', './dist/index.js'], 
                {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true,
                })
            }
        }
    }
}

export default {
    input: 'src/index.ts',
    output: {
        sourcemap: true,
        dir: 'dist',
        format: 'es',
    },
    plugins: [
        externals({
            deps: true,
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),
        json(),
        !local && copyChanges(),
        !local && startRemotely(),
        local && startNode(),
    ],
    watch: {
        clearScreen: false,
        include: ['src/**', 'dist/**'],
        delay: 3000,
    }
}

function copyChanges() {
    return {
        writeBundle() {
            console.log("copying changed files to remote pi");
            require('child_process').spawnSync('rsync', ['-aP', '--delete', '--exclude=".yarn/"', '--exclude="node_modules/"', '$(pwd)/', 'pi@10.8.13.45:/home/pi/Documents/source/repos/SmokerPiAPINode'],
            {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true,
            });

        }
    }
}

function startRemotely() {
    return {
        writeBundle() {
            require('child_process').spawnSync('ssh', ['pi@10.8.13.45', '"sudo service smokerpiapi restart"'], 
            {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true,
            })
        }
    }
}