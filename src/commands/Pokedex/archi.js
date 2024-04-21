const { SlashCommandBuilder, Client, Message, ClientVoiceManager } = require('discord.js');
const addArchi = require('../../utils/Pokedex/addArchi.js');
const listArchi = require('../../utils/Pokedex/listArchi.js');
const removeArchi = require('../../utils/Pokedex/removeArchi');
const aList = require('../../Data/ArchisList.json');
const ArchiSch = require('../../models/ArchiSch.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('archi')
        .setDescription('Pokedex')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Adds an Archie')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('Nombre de el archi')
                        .setAutocomplete(true)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription("Remove archi from collection")
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('Nombre de el archi')
                        .setAutocomplete(true)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Lists an Archie'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('repeated')
                .setDescription('Shows your repeatead archis')),
                
    run: async ({ interaction, client, handler }) => {

        if (interaction.options.getSubcommand() === 'add') {
            //Adding a new archi to the colection
            addArchi(interaction.user, interaction.guild, new ArchiSch({ Name: interaction.options.getString('name') }))
            interaction.reply('Added')
        }
        else if (interaction.options.getSubcommand() === 'list') {
            //Listing Collection
            const aCol = await listArchi(interaction.user.id, interaction.guildId)
            if (aCol) {
                var reply = ""
                aCol.forEach((archi) => {
                    reply += `${archi.Amount}x ${archi.Name}` + '\n';
                })
                interaction.reply(reply);
            }
            else interaction.reply('No archis found, please add your first archi with /archi add');

        }
        else if (interaction.options.getSubcommand() === 'repeated') {
            //Listing Collection
            const aCol = await listArchi(interaction.user.id, interaction.guildId)
            if (aCol) {
                var reply = ""
                aCol.forEach((archi) => {
                    if(archi.Amount>1)reply += `${archi.Amount}x ${archi.Name}` + '\n';
                })
                if (reply=="") interaction.reply('No duplicated archis found')
                else interaction.reply(reply);
            }
            else interaction.reply('No archis found, please add your first archi with /archi add');

        }
        else if (interaction.options.getSubcommand() === 'remove') {
            removeArchi(interaction.user, interaction.guild, new ArchiSch({ Name: interaction.options.getString('name') }))
            interaction.reply('Work in progress')
        }

    },


    //Filtering and whitlisting of archi names
    autocomplete: async ({ interaction, client, handler }) => {
        const focusedOption = interaction.options.getFocused(true).value;
        const filteredChoices = aList.archis.filter(archi => archi.name.toLowerCase().includes(focusedOption.toLowerCase()));
        const results = filteredChoices.map((archi) => {
            return {
                name: `${archi.name}`,
                value: `${archi.name}`,
            };
        });
        interaction.respond(results.slice(0, 25));
    },
    options: {
        //cooldown: '1d',
        //devOnly: true,
        //userPermissions:['Administrator'],
        //botPermissions:['BanMembers'],
        //deleted: true,
    }
}