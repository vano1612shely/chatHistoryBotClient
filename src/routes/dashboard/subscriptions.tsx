import { createFileRoute } from "@tanstack/react-router";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/shared/api/apiClient.ts";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useAppForm } from "@/shared/hooks/form.tsx";

// Types
interface SubscriptionPlan {
  id: number;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreatePlanRequest {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
}

interface UpdatePlanRequest {
  name?: string;
  description?: string;
  price?: number;
  durationDays?: number;
  isActive?: boolean;
}

// API functions
const subscriptionApi = {
  getPlans: (): Promise<{ success: boolean; data: SubscriptionPlan[] }> =>
    apiClient.get({ url: "/api/subscriptions/plans" }),

  createPlan: (
    data: CreatePlanRequest,
  ): Promise<{ success: boolean; data: SubscriptionPlan }> =>
    apiClient.post({ url: "/api/subscriptions/plans", payload: data }),

  updatePlan: (
    id: number,
    data: UpdatePlanRequest,
  ): Promise<{ success: boolean; data: SubscriptionPlan }> =>
    apiClient.put({ url: `/api/subscriptions/plans/${id}`, payload: data }),

  deletePlan: (
    id: number,
  ): Promise<{ success: boolean; data: SubscriptionPlan }> =>
    apiClient.delete({ url: `/api/subscriptions/plans/${id}` }),

  getPlan: (
    id: number,
  ): Promise<{ success: boolean; data: SubscriptionPlan }> =>
    apiClient.get({ url: `/api/subscriptions/plans/${id}` }),
};

// Create Plan Modal
const CreatePlanModal: React.FC = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: subscriptionApi.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      onClose();
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      durationDays: 30,
    },
    onSubmit: ({ value }) => {
      createMutation.mutate(value);
    },
  });

  return (
    <>
      <Button startContent={<Plus />} onPress={onOpen} color="primary">
        Створити план
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <ModalHeader>Створити план підписки</ModalHeader>
            <ModalBody>
              <form.AppField
                name="durationDays"
                children={(field) => (
                  <field.NumberField label={"Тривалість (дні) *"} />
                )}
              />
              <form.AppField
                name="price"
                children={(field) => <field.NumberField label={"Ціна"} />}
              />
              <form.AppField
                name="name"
                children={(field) => <field.TextField label={"Назва"} />}
              />
              <form.AppField
                name="description"
                children={(field) => <field.TextField label={"Опис"} />}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                isLoading={createMutation.isPending}
              >
                Створити
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

// Edit Plan Modal
const EditPlanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: SubscriptionPlan | null;
}> = ({ isOpen, onClose, onSuccess, plan }) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePlanRequest }) =>
      subscriptionApi.updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      onSuccess();
      onClose();
    },
  });

  const form = useForm({
    defaultValues: {
      name: plan?.name || "",
      description: plan?.description || "",
      price: plan?.price || 0,
      durationDays: plan?.durationDays || 30,
      isActive: plan?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      if (plan) {
        await updateMutation.mutateAsync({ id: plan.id, data: value });
      }
    },
  });

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Редагувати план підписки</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4">
            <form.Field
              name="name"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Назва плану *
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введіть назву плану"
                    required
                  />
                </div>
              )}
            />

            <form.Field
              name="description"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Опис
                  </label>
                  <textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Опис плану"
                    rows={3}
                  />
                </div>
              )}
            />

            <form.Field
              name="price"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ціна *
                  </label>
                  <input
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              )}
            />

            <form.Field
              name="durationDays"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тривалість (дні) *
                  </label>
                  <input
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="30"
                    min="1"
                    required
                  />
                </div>
              )}
            />

            <form.Field
              name="isActive"
              children={(field) => (
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Активний план
                    </span>
                  </label>
                </div>
              )}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {updateMutation.isPending ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Plan Details Modal
const PlanDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
}> = ({ isOpen, onClose, plan }) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Деталі плану підписки</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Назва
            </label>
            <p className="text-gray-900">{plan.name}</p>
          </div>

          {plan.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Опис
              </label>
              <p className="text-gray-900">{plan.description}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ціна
            </label>
            <p className="text-gray-900">${plan.price}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тривалість
            </label>
            <p className="text-gray-900">{plan.durationDays} днів</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                plan.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {plan.isActive ? "Активний" : "Неактивний"}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Створено
            </label>
            <p className="text-gray-900">
              {new Date(plan.createdAt).toLocaleDateString("uk-UA")}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Оновлено
            </label>
            <p className="text-gray-900">
              {new Date(plan.updatedAt).toLocaleDateString("uk-UA")}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirm Delete Modal
const ConfirmDeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
  isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, planName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
          <h2 className="text-xl font-semibold">Підтвердити видалення</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Ви впевнені, що хочете видалити план підписки "{planName}"? Цю дію
          неможливо скасувати.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Скасувати
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? "Видалення..." : "Видалити"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Subscription Management Component
const SubscriptionManagement: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );

  const queryClient = useQueryClient();

  const {
    data: plansResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: subscriptionApi.getPlans,
  });

  const deleteMutation = useMutation({
    mutationFn: subscriptionApi.deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      setIsDeleteModalOpen(false);
      setSelectedPlan(null);
    },
  });

  const plans = plansResponse?.data || [];

  const handleEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleView = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPlan) {
      deleteMutation.mutate(selectedPlan.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Помилка завантаження
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Не вдалося завантажити плани підписки. Спробуйте пізніше.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Управління підписками
        </h1>
        <CreatePlanModal />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Плани підписок</h2>
        </div>

        {plans.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Немає планів підписок
            </h3>
            <p className="text-gray-600 mb-4">
              Створіть перший план підписки для початку роботи
            </p>
            <CreatePlanModal />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Назва
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ціна
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тривалість
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Створено
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {plan.name}
                        </div>
                        {plan.description && (
                          <div className="text-sm text-gray-500">
                            {plan.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {plan.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1" />
                        {plan.durationDays} днів
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          plan.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {plan.isActive ? "Активний" : "Неактивний"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(plan.createdAt).toLocaleDateString("uk-UA")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleView(plan)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Переглянути"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(plan)}
                          className="text-green-600 hover:text-green-800"
                          title="Редагувати"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan)}
                          className="text-red-600 hover:text-red-800"
                          title="Видалити"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPlan(null);
        }}
        onSuccess={() => {}}
        plan={selectedPlan}
      />

      <PlanDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPlan(null);
        }}
        onConfirm={confirmDelete}
        planName={selectedPlan?.name || ""}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
export const Route = createFileRoute("/dashboard/subscriptions")({
  component: SubscriptionManagement,
});
