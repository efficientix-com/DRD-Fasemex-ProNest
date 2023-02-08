/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * 
 */
/**
* @name Suitelet Catálogo de Marcas
* @version 1.0
* @author Adrián Aguilar & Ricardo López <adrian.aguilar@freebug.mx,ricardo.lopez@freebug.mx>
* @summary Suitelet que servirá para la pantalla de Catálogo de Marcas
* @copyright Tekiio México 2023
* 
* Client              -> Fasemex  
* Last modification   -> Fecha
* Modified by         -> Adrián Aguilar <adrian.aguilar@freebug.mx>
* Script in NS        -> Registro en Netsuite <ID del registro>
*/
define(['N/log', 'N/runtime', 'N/search','N/ui/serverWidget'],
    /**
 * @param{log} log
 * @param{runtime} runtime
 * @param{search} search
 */
    (log, runtime, search,serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try {
                // var parameters = scriptContext.request.parameters;
                // params = scriptContext.request.parameters;
                var form = crearPanel(scriptContext);
                scriptContext.response.writePage({ pageObject: form });

            } catch (e) {
                log.error({ title: 'onRequest', details: e });

                var error = errform(e);
                scriptContext.response.writePage({
                    pageObject: error
                })
            }

        }

        /**
         * @summary Función para poder crear la interfaz de la pantalla
         */
        function crearPanel() {
            try {
                var form = serverWidget.createForm({ title: "Carga de Marcas" });
                // form.clientScriptModulePath = './tkio_catalogo_marcas_cs.js';
                var enviar = form.addButton({ id: "custpage_tkio_send_load_catalogue", label: "Enviar", functionName: 'enviar'});
                var family = form.addField({ id: "custpage_tkio_family", type: serverWidget.FieldType.SELECT, label: "Familia" })
                var search = form.addField({ id: "custpage_tkio_saved_search", type: serverWidget.FieldType.SELECT, label: "Búsqueda Guardada",source: 'savedsearch' })//source: 'assemblyitem'})
                var clientPronest = form.addField({ id: "custpage_tkio_client_pronest", type: serverWidget.FieldType.SELECT, label: "Cliente ProNest" })
                var validateData = form.addField({ id: "custpage_tkio_valid_data", type: serverWidget.FieldType.CHECKBOX, label: "Validar datos en Pronest" })

                let busquedas = searchBusquedas();
                search.addSelectOption({value: '', text: ''})
                for(var i = 0; i<busquedas.length;i++){
                    search.addSelectOption({value: busquedas[i].id, text: busquedas[i].nombre})
                }
                family.addSelectOption({ value: '', text: ''});
                family.addSelectOption({ value: 'placa', text: 'Placa'});
                family.addSelectOption({ value: 'perfil', text: 'Perfil'});
                family.addSelectOption({ value: 'hola', text: 'Hola'});

                return form;
            } catch (e) {
                log.error({ title: 'crearPanel', details: e });

            }
        }

        /**
         * @summary Función que traerá todas las búsquedas existentes en Netsuite
         */
        function searchBusquedas(){
            try{
                // log.debug({title: 'holi', details: 'holi'});
                var arrBusquedas = []
                var savedsearchSearchObj = search.create({
                    type: search.Type.SAVED_SEARCH,
                    filters:
                    [
                    ],
                    columns:
                    [
                       search.createColumn({name: "title", label: "Título"}),
                       search.createColumn({name: "internalid", label: "ID interno"})
                    ]
                 });
                 var searchResultCount = savedsearchSearchObj.runPaged().count;
                 log.debug("savedsearchSearchObj result count",searchResultCount);
                 savedsearchSearchObj.run().each(function(result){
                    var nombre = result.getValue({ name: "title" });
                    var id = result.getValue({name:'internalid'})
                    arrBusquedas.push({
                        id:id,
                        nombre:nombre
                    })
                    // .run().each has a limit of 4,000 results
                    return true;
                 });
                 return arrBusquedas;
            }catch(e){
                log.error('searchBusquedas: ',e);
            }
             
             

        }

        /**
         * Función errform que servirá para generar la página de error
         * en caso de haber uno
         * @param{details} -> Detalles del error
         */
        function errform(details) {
            try {
                var form = serverWidget.createForm({
                    title: 'Formulario de citas'
                });
                var htmlfld = form.addField({
                    id: 'custpage_msg_error',
                    label: ' ',
                    type: serverWidget.FieldType.INLINEHTML
                });
                htmlfld.defaultValue = '<b> Ha ocurrido un error, contacte con su administrador</b>' +
                    '<br/> Detalles: ' + JSON.stringify(details);

                return form;

            }
            catch (e) {
                log.error({ title: 'errForm', details: e });
            }
        }
        return { onRequest }

    });
