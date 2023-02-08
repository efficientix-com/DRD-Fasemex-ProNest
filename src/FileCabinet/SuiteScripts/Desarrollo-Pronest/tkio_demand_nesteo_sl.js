/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
 /**
 * @name Tkio - Demanda de Nesteo - SL
 * @version 1.0
 * @author Adrián Aguilar & Ricardo López <adrian.aguilar@freebug.mx,ricardo.lopez@freebug.mx>
 * @summary Script que servirá para la pantalla de Demanda para realizar el Nesteo.
 * @copyright Tekiio México 2022
 * 
 * Client              -> Fasemex
 * Last modification   -> Fecha
 * Modified by         -> Adrián Aguilar <adrian.aguilar@freebug.mx>
 * Script in NS        -> Registro en Netsuite <ID del registro>
 */
define(['N/log', 'N/search','N/ui/serverWidget'],
    /**
 * @param{log} log
 * @param{search} search
 */
    (log, search,serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                var form = crearPanel(scriptContext);
                scriptContext.response.writePage({pageObject: form});

                
            }catch(e){
                log.error({title:'Error onRequest',details:e});
                var formerror = errForm(e);
                scriptContext.response.writePage({
                    pageObject: formerror
                });
            }
        }

        /**
         * @summary Función para crear la Interfaz de la Pantalla
         * @returns form
         */
        function crearPanel(){
            try{
                var form = serverWidget.createForm({title: "Carga de Órdenes de Trabajo"})
                var obtener = form.addButton({ id: "custpage_tkio_to_list", label: "Obtener Listado"});
                var generar = form.addButton({ id: "custpage_tkio_generate", label: "Generar"});
                var busqueda = form.addField({ id: "custpage_tkio_saved_search", type: serverWidget.FieldType.SELECT, label: "Búsqueda Guardada" });
                
                var listaDatos = form.addSublist({ id: 'sublist_table_data', type: serverWidget.SublistType.LIST, label: 'Tabla Datos' });
                var ordenTrabajo = listaDatos.addField({ id: 'sublist_orden_trabajo', type: serverWidget.FieldType.TEXT, label: 'Orden de Trabajo' });
                var marca = listaDatos.addField({ id: 'sublist_marca', type: serverWidget.FieldType.TEXT, label: 'Marca' });
                var cantidad = listaDatos.addField({ id: 'sublist_cantidad', type: serverWidget.FieldType.INTEGER, label: 'Cantidad' });

                ordenTrabajo.updateDisplayType({ displayType: serverWidget.FieldDisplayType.INLINE });
                marca.updateDisplayType({ displayType: serverWidget.FieldDisplayType.INLINE });
                cantidad.updateDisplayType({ displayType: serverWidget.FieldDisplayType.ENTRY });



                return form;
            }catch(e){
                var formerror = errForm(e);
                scriptContext.response.writePage({
                    pageObject: formerror
                });
            }
        }

        /**
         * @param {details} -> Detalles del error. 
         * @summary Función erroform que servirá para generar la pagina de error
         * en caso de encontrar alguno.
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

        return {onRequest}

    });
