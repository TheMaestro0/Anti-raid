import { Command, Formatters, Message, MessageEmbed } from 'discord.js'
import { inspect } from 'util'
import { kindOf } from '../utils'

export class EvalCommand implements Command {
    name = 'eval'
    async run(message: Message): Promise<unknown> {
        let code = message.content,
            output = 'Empty',
            type = 'unknown'

        if (code.startsWith('```js') && code.endsWith('```')) {
            code = code.slice(5, -3)
        }

        try {
            const result = eval(code)

            if (kindOf(result) === 'Promise<any>') {
                output = await result
                type = `Promise<${kindOf(output)}>`
            } else {
                output = result
                type = kindOf(output)
            }

            output = typeof output === 'string' ? output : inspect(output, { depth: 0 })
        } catch (error) {
            type = error instanceof Error ? error.name : kindOf(error)
            output = typeof error === 'string' ? error : inspect(error, { depth: 0 })
        }

        output = Formatters.codeBlock('js', output.replace(/`/g, '`' + String.fromCharCode(8203)))

        if (output.includes(message.client.token!)) {
            return message.reply('Nope!')
        }

        if (output.length > 4000) {
            return message.reply({
                files: [
                    {
                        name: 'file.txt',
                        attachment: Buffer.from(output)
                    }
                ]
            })
        }

        const embed = new MessageEmbed()
            .setDescription(output)
            .setColor('#2f3136')
            .addField('type', Formatters.codeBlock('ts', type))

        return message.reply({ embeds: [embed] })
    }
}
