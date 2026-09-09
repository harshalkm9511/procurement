import { Router } from 'express';
import { createCrudController } from '../controllers/crud.controller.js';
import { addRfqSupplier, listRfqSuppliers, removeRfqSupplier } from '../controllers/rfq-suppliers.controller.js';
import { loadProfile, requireAuthentication, requireRoles } from '../middleware/auth.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.js';
import { CrudService } from '../services/crud.service.js';
import {
  assetBody, assetListQuery, assetPatchBody, idParams, inventoryBody, inventoryListQuery, inventoryPatchBody,
  purchaseOrderBody, purchaseOrderListQuery, purchaseOrderPatchBody, quotationBody, quotationListQuery, quotationPatchBody,
  rfqBody, rfqListQuery, rfqPatchBody, rfqSupplierBody, rfqSupplierParams, spendRecordBody, spendRecordListQuery,
  spendRecordPatchBody, supplierBody, supplierListQuery, supplierPatchBody,
} from '../validators/procurement.schemas.js';

const writer = requireRoles('admin', 'manager', 'procurement');
const protectedRoute = [requireAuthentication, loadProfile];

function resources(service: CrudService, references?: (body: Record<string, unknown>) => Array<{ table: string; id: string | null | undefined; label: string }>, createFields?: (body: Record<string, unknown>, context: { userId: string }) => Record<string, unknown>) {
  return createCrudController({ service, references, createFields: createFields as never });
}

const suppliers = resources(new CrudService({ table: 'suppliers', organizationScopedReads: false, deleteGuards: [{ table: 'quotations', column: 'supplier_id', message: 'Cannot delete a supplier with quotations' }, { table: 'purchase_orders', column: 'supplier_id', message: 'Cannot delete a supplier with purchase orders' }] }));
const rfqs = resources(new CrudService({ table: 'rfqs', deleteGuards: [{ table: 'quotations', column: 'rfq_id', message: 'Cannot delete an RFQ with quotations' }, { table: 'purchase_orders', column: 'rfq_id', message: 'Cannot delete an RFQ with purchase orders' }] }), (body) => [{ table: 'departments', id: body.department_id as string | null | undefined, label: 'department' }], (body, context) => ({ ...body, created_by: context.userId }));
const quotations = resources(new CrudService({ table: 'quotations' }), (body) => [{ table: 'rfqs', id: body.rfq_id as string | undefined, label: 'RFQ' }, { table: 'suppliers', id: body.supplier_id as string | undefined, label: 'supplier' }]);
const purchaseOrders = resources(new CrudService({ table: 'purchase_orders' }), (body) => [{ table: 'rfqs', id: body.rfq_id as string | null | undefined, label: 'RFQ' }, { table: 'quotations', id: body.quotation_id as string | null | undefined, label: 'quotation' }, { table: 'suppliers', id: body.supplier_id as string | undefined, label: 'supplier' }]);
const inventory = resources(new CrudService({ table: 'inventory_items' }), (body) => [{ table: 'suppliers', id: body.supplier_id as string | null | undefined, label: 'supplier' }]);
const assets = resources(new CrudService({ table: 'assets' }), (body) => [{ table: 'inventory_items', id: body.inventory_item_id as string | null | undefined, label: 'inventory item' }, { table: 'departments', id: body.department_id as string | null | undefined, label: 'department' }, { table: 'profiles', id: body.assigned_profile_id as string | null | undefined, label: 'profile' }]);
const spendRecords = resources(new CrudService({ table: 'spend_records' }), (body) => [{ table: 'suppliers', id: body.supplier_id as string | null | undefined, label: 'supplier' }, { table: 'purchase_orders', id: body.purchase_order_id as string | null | undefined, label: 'purchase order' }]);

function registerCrud(router: Router, path: string, controller: ReturnType<typeof createCrudController>, listQuery: Parameters<typeof validateQuery>[0], createBody: Parameters<typeof validateBody>[0], patchBody: Parameters<typeof validateBody>[0]) {
  router.get(path, ...protectedRoute, validateQuery(listQuery), controller.list);
  router.get(`${path}/:id`, ...protectedRoute, validateParams(idParams), controller.get);
  router.post(path, ...protectedRoute, writer, validateBody(createBody), controller.create);
  router.patch(`${path}/:id`, ...protectedRoute, writer, validateParams(idParams), validateBody(patchBody), controller.update);
  router.delete(`${path}/:id`, ...protectedRoute, writer, validateParams(idParams), controller.delete);
}

export const procurementRouter = Router();
registerCrud(procurementRouter, '/suppliers', suppliers, supplierListQuery, supplierBody, supplierPatchBody);
registerCrud(procurementRouter, '/rfqs', rfqs, rfqListQuery, rfqBody, rfqPatchBody);
registerCrud(procurementRouter, '/quotations', quotations, quotationListQuery, quotationBody, quotationPatchBody);
registerCrud(procurementRouter, '/purchase-orders', purchaseOrders, purchaseOrderListQuery, purchaseOrderBody, purchaseOrderPatchBody);
registerCrud(procurementRouter, '/inventory', inventory, inventoryListQuery, inventoryBody, inventoryPatchBody);
registerCrud(procurementRouter, '/assets', assets, assetListQuery, assetBody, assetPatchBody);
registerCrud(procurementRouter, '/spend-records', spendRecords, spendRecordListQuery, spendRecordBody, spendRecordPatchBody);

procurementRouter.get('/rfqs/:id/suppliers', ...protectedRoute, validateParams(idParams), listRfqSuppliers);
procurementRouter.post('/rfqs/:id/suppliers', ...protectedRoute, writer, validateParams(idParams), validateBody(rfqSupplierBody), addRfqSupplier);
procurementRouter.delete('/rfqs/:id/suppliers/:supplierId', ...protectedRoute, writer, validateParams(rfqSupplierParams), removeRfqSupplier);
